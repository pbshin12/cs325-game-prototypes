using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Laser : MonoBehaviour
{
    AudioSource audioSource;
    public AudioClip playerOOFSound;
    public AudioClip playerHurtSound;
    public float projectileSpeed = 10f;
    public Rigidbody2D rb;


    // Start is called before the first frame update
    void Start()
    {
        rb.velocity = -transform.right * (projectileSpeed);
        audioSource = GetComponent<AudioSource>();
    }


    /* Do something if laser collides with an enemy */
    private void OnTriggerEnter2D(Collider2D collision)
    {
        Debug.Log("Collided with: " + collision.name);

        if (collision.name == "skeletonSoldier" || collision.gameObject.tag == "FireBall")
        {
            Debug.Log("Laser hitting each other");
            return;
        }

        if (collision.gameObject.tag == "Player")
        {
            //TODO --> deal damage to player
            GameManager.playerHealth -= 1;
            Debug.Log("Player health is now at: " + GameManager.bossHealth);
            AudioSource.PlayClipAtPoint(playerOOFSound, new Vector3(0, 0, -10));
            AudioSource.PlayClipAtPoint(playerHurtSound, new Vector3(0, 0, -10));
        }

        Destroy(gameObject);
    }


}
