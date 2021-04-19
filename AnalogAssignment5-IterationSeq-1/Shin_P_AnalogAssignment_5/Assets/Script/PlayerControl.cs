using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerControl : MonoBehaviour
{
    public PlayerAttack playerAttack;
    public float yVal = 3.0f;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space) || Input.GetKeyDown(KeyCode.W))
        {
            var vel = GetComponent<Rigidbody2D>().velocity;
            vel.y = yVal;
            GetComponent<Rigidbody2D>().velocity = vel;
        }
        else if (Input.GetKeyDown(KeyCode.J))
        {
            playerAttack.shoot();
        }
    }
}
