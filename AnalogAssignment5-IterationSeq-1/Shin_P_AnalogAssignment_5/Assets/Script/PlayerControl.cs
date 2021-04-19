using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerControl : MonoBehaviour
{
    private bool explosionPlayed = false;

    public int playerHealth = 3;
    public PlayerSoundFX playerSoundFX;
    public PlayerAttack playerAttack;
    public float yVal = 3.0f;
    
    // Start is called before the first frame update
    void Start()
    {
      
    }

    // Update is called once per frame
    void Update()
    {
        /* Players can hop using the SPACE and W buttons and shoot with J */
        if (Input.GetKeyDown(KeyCode.Space) || Input.GetKeyDown(KeyCode.W))
        {
            var vel = GetComponent<Rigidbody2D>().velocity;
            vel.y = yVal;
            GetComponent<Rigidbody2D>().velocity = vel;
            playerSoundFX.hopSoundFX();
        }
        else if (Input.GetKeyDown(KeyCode.J))
        {
            playerAttack.shoot();
            playerSoundFX.shootSoundFX();
        }

        if (!GameManager.playerAlive)
        {
            Debug.Log("Player is dead");
            /* Explosion will only play once */
            if (!explosionPlayed)
            {
                playerSoundFX.playerExplosion();
                this.explosionPlayed = true;
            }

        }
    }
}
